// Campo de formulário reutilizável (label + input)
export default function FormField({ label, id, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
      />
    </div>
  );
}