export interface Action<T> {
  label: string;
  onClick: (row: T) => void;
}
