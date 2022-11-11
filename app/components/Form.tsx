type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "name" | "type" | "placeholder"
>;

export function FloatingLabelInput({
  name,
  type,
  label,
  error,
  ...inputProps
}: {
  name: string;
  type: string;
  label: string;
  error?: string;
} & InputProps) {
  return (
    <div className="space-y-1">
      <div className="relative border-2 border-gray-200 rounded focus-within:border-blue-500 pl-2 pt-2">
        <input
          className="peer placeholder-transparent w-full h-10 focus:outline-none dark:bg-gray-800"
          id={name}
          type={type}
          name={name}
          placeholder={name}
          {...inputProps}
        />
        <label
          className="absolute left-2 top-0 text-gray-600 dark:text-gray-200 text-sm transition-all
          peer-placeholder-shown:text-base peer-placeholder-shown:top-2.5
          peer-focus:text-sm peer-focus:text-blue-500 peer-focus:top-0
          "
          htmlFor={name}
        >
          {label}
        </label>
      </div>
      {error && (
        <div
          className="text-red-500 dark:text-red-300 mt-2 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
