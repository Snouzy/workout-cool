interface AdPlaceholderProps {
  width: string;
  height: string;
  type?: string;
}

export function AdPlaceholder({ width, height, type = "Ad" }: AdPlaceholderProps) {
  return (
    <div
      className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded"
      style={{ width, height }}
    >
      <span className="text-gray-500 dark:text-gray-400 font-medium text-center">
        {type} {width} × {height}
      </span>
    </div>
  );
}
