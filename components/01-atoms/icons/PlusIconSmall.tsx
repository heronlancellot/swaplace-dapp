import { SVGProps } from "react";

export const PlusIconSmall = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Plus">
        <path
          id="Vector"
          d="M6.705 1.875C6.705 1.46016 6.36985 1.125 5.955 1.125C5.54016 1.125 5.205 1.46016 5.205 1.875V5.25H1.83C1.41516 5.25 1.08 5.58516 1.08 6C1.08 6.41484 1.41516 6.75 1.83 6.75H5.205L5.205 10.125C5.205 10.5398 5.54016 10.875 5.955 10.875C6.36985 10.875 6.705 10.5398 6.705 10.125L6.705 6.75L10.08 6.75C10.4948 6.75 10.83 6.41484 10.83 6C10.83 5.58516 10.4948 5.25 10.08 5.25L6.705 5.25V1.875Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};
