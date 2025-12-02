export interface ComponentData {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface ColumnData {
  id: string;
  width: number; // 1-12 for a 12-column grid
  components: ComponentData[];
  orientation: "horizontal" | "vertical";
  parentId?: string | null;
  childColumns?: ColumnData[];
  flexLayout?: string; // For flex container layout
  gap?: string; // For gap between elements
}

export interface GridLayout {
  columns: ColumnData[];
  containerWidth: string;
}

export interface DragItem {
  type: "COMPONENT" | "COLUMN";
  id: string;
  columnId?: string;
  index: number;
}
