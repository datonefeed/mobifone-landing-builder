import type { GridLayout, ColumnData, ComponentData } from "./types";

export function generateReactCode(layout: GridLayout): string {
  const imports = generateImports(layout);
  const componentCode = generateComponentCode(layout);

  return `${imports}

export default function GeneratedUI() {
  return (
${componentCode}
  );
}`;
}

function generateImports(layout: GridLayout): string {
  const importMap: Record<string, Set<string>> = {
    react: new Set(["useState", "useEffect"]),
    "@/components/ui": new Set(),
  };

  // Helper function to analyze components in columns
  const analyzeComponents = (columns: ColumnData[] = []) => {
    if (!columns) return;

    columns.forEach((column) => {
      if (!column) return;

      if (column.components) {
        column.components.forEach((component) => {
          if (!component) return;

          switch (component.type) {
            case "button":
              importMap["@/components/ui"].add("Button");
              break;
            case "input":
              importMap["@/components/ui"].add("Input");
              break;
            // Add other component imports as needed
          }
        });
      }

      // Recursively analyze nested columns
      if (column.childColumns && column.childColumns.length > 0) {
        analyzeComponents(column.childColumns);
      }
    });
  };

  // Start analysis from root columns
  analyzeComponents(layout.columns);

  // Generate import statements
  let importStatements = "";

  for (const [module, components] of Object.entries(importMap)) {
    if (components.size > 0) {
      importStatements += `import { ${Array.from(components).join(", ")} } from "${module}";\n`;
    }
  }

  return importStatements;
}

function generateComponentCode(layout: GridLayout): string {
  let code = `    <div style={{ width: "${layout.containerWidth || "100%"}", margin: "0 auto" }}>\n`;

  // Helper function to recursively generate column code
  const generateColumnsCode = (columns: ColumnData[] = [], indentLevel = 6) => {
    if (!columns || columns.length === 0) {
      return `${" ".repeat(indentLevel)}<div className="flex flex-wrap"></div>`;
    }

    const indent = " ".repeat(indentLevel);
    let columnsCode = "";

    columns.forEach((column) => {
      if (!column) return;

      const orientation = column.orientation || "horizontal";
      const columnWidthClass = getColumnWidthClass(column.width);
      const flexDirection = orientation === "horizontal" ? "flex-row" : "flex-col";

      // Add flex layout and gap classes if they exist
      const flexLayout = column.flexLayout || "items-start justify-start";
      const flexGap = column.gap || "0";

      // Extract items and justify values from flexLayout
      const itemsMatch = flexLayout.match(/items-([a-z-]+)/);
      const justifyMatch = flexLayout.match(/justify-([a-z-]+)/);
      const itemsValue = itemsMatch ? itemsMatch[1] : "start";
      const justifyValue = justifyMatch ? justifyMatch[1] : "start";

      const flexClasses = `flex ${flexDirection} items-${itemsValue} justify-${justifyValue} gap-${flexGap}`;

      columnsCode += `${indent}<div className="${columnWidthClass} p-2">\n`;
      columnsCode += `${indent}  <div className="${flexClasses} p-4">\n`;

      // Add components in this column
      if (column.components && column.components.length > 0) {
        column.components.forEach((component) => {
          if (!component) return;
          columnsCode += `${indent}    ${renderComponent(component)}\n`;
        });
      }

      // Add nested columns if they exist
      if (column.childColumns && column.childColumns.length > 0) {
        columnsCode += `${indent}    ${generateColumnsCode(column.childColumns, indentLevel + 4)}\n`;
      }

      columnsCode += `${indent}  </div>\n`;
      columnsCode += `${indent}</div>\n`;
    });

    return columnsCode.trim();
  };

  code += generateColumnsCode(layout.columns);
  code += `\n    </div>`;

  return code;
}

function getColumnWidthClass(width = 12): string {
  const widthMap: Record<number, string> = {
    1: "w-1/12",
    2: "w-2/12",
    3: "w-3/12",
    4: "w-4/12",
    5: "w-5/12",
    6: "w-6/12",
    7: "w-7/12",
    8: "w-8/12",
    9: "w-9/12",
    10: "w-10/12",
    11: "w-11/12",
    12: "w-full",
  };
  return widthMap[width] || "w-full";
}

function renderComponent(component: ComponentData): string {
  if (!component) return "";

  const { type, props = {} } = component;

  switch (type) {
    case "button":
      return `<Button${renderProps(props)}>${props.text || "Button"}</Button>`;
    case "input":
      return `<Input${renderProps(props)} />`;
    case "text":
      const Element = (props.element as string) || "p";
      return `<${Element}${renderProps(props)}>${props.text || (Element === "p" ? "Paragraph text" : `${Element.toUpperCase()} Heading`)}</${Element}>`;
    case "image":
      return `<img${renderProps(props)} />`;
    case "div":
      return `<div${renderProps(props)}>${props.text || "Div Container"}</div>`;
    case "nested-column":
      return `<div className="nested-column-container">Nested Column</div>`;
    default:
      return `<div>Unknown component: ${type}</div>`;
  }
}

function renderProps(props: Record<string, unknown> = {}): string {
  let propsString = "";

  // Handle className
  if (props.className) {
    propsString += ` className="${props.className}"`;
  }

  // Handle component-specific props
  switch (true) {
    case "variant" in props:
      propsString += ` variant="${props.variant}"`;
      break;
    case "size" in props:
      propsString += ` size="${props.size}"`;
      break;
    case "placeholder" in props:
      propsString += ` placeholder="${props.placeholder}"`;
      break;
    case "type" in props && props.type !== "div":
      propsString += ` type="${props.type}"`;
      break;
  }

  // Handle image-specific props
  if ("src" in props) {
    propsString += ` src="${props.src}"`;
  }
  if ("alt" in props) {
    propsString += ` alt="${props.alt}"`;
  }

  // Handle style props
  const styleProps = [
    "width",
    "height",
    "backgroundColor",
    "padding",
    "borderRadius",
    "border",
    "fontSize",
  ];
  const hasStyleProps = styleProps.some((prop) => prop in props);

  if (hasStyleProps) {
    propsString += ` style={{`;
    let styleString = "";

    styleProps.forEach((prop) => {
      if (prop in props) {
        // Convert kebab-case to camelCase for React style props
        const camelCaseProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleString += `${camelCaseProp}: "${props[prop]}", `;
      }
    });

    propsString += styleString.slice(0, -2); // Remove trailing comma and space
    propsString += `}}`;
  }

  return propsString;
}
