export type NodeType = 'note' | 'task' | 'milestone' | 'link' | 'image' | 'text';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export type NodeColor =
  | 'neutral'
  | 'sage'
  | 'sky'
  | 'amber'
  | 'lavender'
  | 'rose'
  | 'slate';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface NodeItem {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height?: number;
  title: string;
  color: NodeColor;
  locked?: boolean;
  zIndex?: number;
  tags?: string[];

  content?: string;
  checklist?: ChecklistItem[];

  status?: TaskStatus;
  dueDate?: string;
  priority?: Priority;
  assignee?: string;

  targetDate?: string;
  milestoneStatus?: 'planned' | 'in-progress' | 'achieved';
  progress?: number;

  url?: string;
  linkDescription?: string;

  imageUrl?: string;
  caption?: string;

  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontFamily?: 'sans' | 'serif' | 'mono' | 'handwriting';
  textAlign?: 'left' | 'center' | 'right';
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  textColor?: string;
  transparentBg?: boolean;
}

export type ConnectionHandle = 'top' | 'right' | 'bottom' | 'left';

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourceHandle?: ConnectionHandle;
  targetNodeId: string;
  targetHandle?: ConnectionHandle;
  label?: string;
  color?: string;
  animated?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  text: string;
  type: 'create' | 'update' | 'delete' | 'milestone' | 'connect';
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export type DrawingTool = 'select' | 'pen' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle' | 'text';

export interface DrawingPoint {
  x: number;
  y: number;
  pressure?: number;
}

export type DrawingElementType = 'stroke' | 'line' | 'arrow' | 'rect' | 'circle';

export interface DrawingElement {
  id: string;
  type: DrawingElementType;
  points: DrawingPoint[];
  color: string;
  strokeWidth: number;
  opacity?: number;
  fill?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  notes: string;
  nodes: NodeItem[];
  connections: Connection[];
  drawings?: DrawingElement[];
  activity: ActivityLog[];
  viewport: CanvasViewport;
}

export type ViewMode = 'dashboard' | 'canvas';
