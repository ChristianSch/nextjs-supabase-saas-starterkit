export default function ErrorMessage({
  error,
  errorDescription
}: {
  error: string | null;
  errorDescription: string | null;
}) {
  if (!error) return null;

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
      role="alert"
    >
      <strong className="font-bold">{error}</strong>
      <span className="block sm:inline"> {errorDescription}</span>
    </div>
  );
}
