interface CloseCTAProps {
  onClick: () => void;
  className?: string;
}

export const CloseCTA = ({ onClick, className = "" }: CloseCTAProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full border border-darkGray dark:hover:bg-darkGray hover:bg-zinc-200 transition"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill={"currentColor"}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="xmark-solid 1">
          <path
            id="Vector"
            d="M11.12 4.12002C11.4618 3.77822 11.4618 3.22314 11.12 2.88135C10.7782 2.53955 10.2231 2.53955 9.88135 2.88135L7.00205 5.76338L4.12002 2.88408C3.77822 2.54229 3.22314 2.54229 2.88135 2.88408C2.53955 3.22588 2.53955 3.78096 2.88135 4.12275L5.76338 7.00205L2.88408 9.88408C2.54229 10.2259 2.54229 10.781 2.88408 11.1228C3.22588 11.4646 3.78096 11.4646 4.12275 11.1228L7.00205 8.24072L9.88408 11.12C10.2259 11.4618 10.781 11.4618 11.1228 11.12C11.4646 10.7782 11.4646 10.2231 11.1228 9.88135L8.24072 7.00205L11.12 4.12002Z"
            fill={"currentColor"}
          />
        </g>
      </svg>
    </button>
  );
};
