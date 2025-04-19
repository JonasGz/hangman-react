type ButtonCProps = {
  name: string;
};

export function ButtonC(props: ButtonCProps) {
  return (
    <button className="cursor-pointer bg-black hover:bg-gray-950 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-neutral-200 dark:border-neutral-800">
      {props.name}
    </button>
  );
}
