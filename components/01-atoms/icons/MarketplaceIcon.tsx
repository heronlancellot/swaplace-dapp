import { SVGProps } from "react";

export const MarketplaceIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Market">
        <path
          id="Vector"
          d="M1.15 8H18.85C19.4844 8 20 7.48438 20 6.85C20 6.62187 19.9312 6.4 19.8062 6.2125L17.4438 2.66875C17.1656 2.25 16.7 2 16.1969 2H3.80312C3.30312 2 2.83438 2.25 2.55625 2.66875L0.19375 6.20937C0.06875 6.4 0 6.62188 0 6.84688C0 7.48438 0.515625 8 1.15 8ZM2 9V14V16.5C2 17.3281 2.67188 18 3.5 18H10.5C11.3281 18 12 17.3281 12 16.5V14V9H10V14H4V9H2ZM16 9V17C16 17.5531 16.4469 18 17 18C17.5531 18 18 17.5531 18 17V9H16Z"
          fill={"currentColor"}
        />
      </g>
    </svg>
  );
};
