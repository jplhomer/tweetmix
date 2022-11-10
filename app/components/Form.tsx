export function FloatingLabelInput({
  name,
  type,
  label,
}: {
  name: string;
  type: string;
  label: string;
}) {
  return (
    <div className="relative border-2 border-gray-200 rounded focus-within:border-blue-500 pl-2 pt-2">
      <input
        className="peer placeholder-transparent w-full h-10 focus:outline-none"
        id={name}
        type={type}
        name={name}
        placeholder={name}
      />
      <label
        className="absolute left-2 -top-0.5 text-gray-600 text-sm transition-all
          peer-placeholder-shown:text-base peer-placeholder-shown:top-2.5
          peer-focus:text-sm peer-focus:text-blue-500 peer-focus:-top-0.5
          "
        htmlFor={name}
      >
        {label}
      </label>
    </div>
  );
}
