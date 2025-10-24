export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={
        'px-3 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 ' +
        'text-sm ' + className
      }
      {...props}
    >
      {children}
    </button>
  )
}
