interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return <div className="mt-1 flex items-start text-sm text-red-600">{message}</div>;
}
