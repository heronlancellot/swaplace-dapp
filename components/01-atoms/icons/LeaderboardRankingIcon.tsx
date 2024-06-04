import { SVGProps } from "react";

export enum Ranking {
  FIRST = "1",
  SECOND = "2",
  THIRD = "3",
}

enum RankingColor {
  FIRST = "#DDF23D",
  SECOND = "#A3A9A5",
  THIRD = "#DE7B30",
}

interface ArrowIconProps {
  props?: SVGProps<SVGSVGElement>;
  variant?: Ranking;
}

export const LeaderboardRankingIcon = ({
  props,
  variant = Ranking.FIRST,
}: ArrowIconProps) => {
  const LeaderboardRanking: Partial<Record<Ranking, React.ReactElement>> = {
    [Ranking.FIRST]: (
      <svg
        {...props}
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Background" filter="url(#filter0_d_1357_7056)">
          <path
            d="M17.8595 7.34214C18.5469 6.88595 19.4468 6.88595 20.1342 7.34214L21.2466 8.0733C21.6215 8.31702 22.059 8.43575 22.5027 8.41075L23.8337 8.32951C24.6586 8.27952 25.4335 8.72946 25.8022 9.46687L26.4022 10.6605C26.6021 11.0604 26.9271 11.3791 27.3208 11.5791L28.5269 12.1853C29.2643 12.554 29.7142 13.3289 29.6642 14.1538L29.583 15.4848C29.558 15.9285 29.6767 16.3722 29.9205 16.7409L30.6579 17.8533C31.114 18.5407 31.114 19.4406 30.6579 20.128L29.9205 21.2466C29.6767 21.6215 29.558 22.059 29.583 22.5027L29.6642 23.8337C29.7142 24.6586 29.2643 25.4335 28.5269 25.8022L27.3333 26.4022C26.9333 26.6021 26.6146 26.9271 26.4147 27.3208L25.8085 28.5269C25.4398 29.2643 24.6649 29.7142 23.84 29.6642L22.5089 29.583C22.0652 29.558 21.6215 29.6767 21.2528 29.9205L20.1405 30.6579C19.4531 31.114 18.5532 31.114 17.8658 30.6579L16.7472 29.9205C16.3722 29.6767 15.9348 29.558 15.4911 29.583L14.16 29.6642C13.3351 29.7142 12.5602 29.2643 12.1915 28.5269L11.5916 27.3333C11.3916 26.9333 11.0667 26.6146 10.673 26.4147L9.46687 25.8085C8.72946 25.4398 8.27952 24.6649 8.32951 23.84L8.41075 22.5089C8.43575 22.0652 8.31702 21.6215 8.0733 21.2528L7.34214 20.1342C6.88595 19.4468 6.88595 18.5469 7.34214 17.8595L8.0733 16.7472C8.31702 16.3722 8.43575 15.9348 8.41075 15.4911L8.32951 14.16C8.27952 13.3351 8.72946 12.5602 9.46687 12.1915L10.6605 11.5916C11.0604 11.3854 11.3854 11.0604 11.5853 10.6605L12.1853 9.46687C12.554 8.72946 13.3289 8.27952 14.1538 8.32951L15.4848 8.41075C15.9285 8.43575 16.3722 8.31702 16.7409 8.0733L17.8595 7.34214Z"
            fill={RankingColor.FIRST}
          />
        </g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill="black"
        >
          {Ranking.FIRST}
        </text>
        <defs>
          <filter
            id="filter0_d_1357_7056"
            x="0"
            y="0"
            width="38"
            height="38"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="1"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_1357_7056"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1357_7056"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1357_7056"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    ),
    [Ranking.SECOND]: (
      <svg
        {...props}
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Background" filter="url(#filter0_d_1357_7082)">
          <path
            d="M17.8595 7.34214C18.5469 6.88595 19.4468 6.88595 20.1342 7.34214L21.2466 8.0733C21.6215 8.31702 22.059 8.43575 22.5027 8.41075L23.8337 8.32951C24.6586 8.27952 25.4335 8.72946 25.8022 9.46687L26.4022 10.6605C26.6021 11.0604 26.9271 11.3791 27.3208 11.5791L28.5269 12.1853C29.2643 12.554 29.7142 13.3289 29.6642 14.1538L29.583 15.4848C29.558 15.9285 29.6767 16.3722 29.9205 16.7409L30.6579 17.8533C31.114 18.5407 31.114 19.4406 30.6579 20.128L29.9205 21.2466C29.6767 21.6215 29.558 22.059 29.583 22.5027L29.6642 23.8337C29.7142 24.6586 29.2643 25.4335 28.5269 25.8022L27.3333 26.4022C26.9333 26.6021 26.6146 26.9271 26.4147 27.3208L25.8085 28.5269C25.4398 29.2643 24.6649 29.7142 23.84 29.6642L22.5089 29.583C22.0652 29.558 21.6215 29.6767 21.2528 29.9205L20.1405 30.6579C19.4531 31.114 18.5532 31.114 17.8658 30.6579L16.7472 29.9205C16.3722 29.6767 15.9348 29.558 15.4911 29.583L14.16 29.6642C13.3351 29.7142 12.5602 29.2643 12.1915 28.5269L11.5916 27.3333C11.3916 26.9333 11.0667 26.6146 10.673 26.4147L9.46687 25.8085C8.72946 25.4398 8.27952 24.6649 8.32951 23.84L8.41075 22.5089C8.43575 22.0652 8.31702 21.6215 8.0733 21.2528L7.34214 20.1342C6.88595 19.4468 6.88595 18.5469 7.34214 17.8595L8.0733 16.7472C8.31702 16.3722 8.43575 15.9348 8.41075 15.4911L8.32951 14.16C8.27952 13.3351 8.72946 12.5602 9.46687 12.1915L10.6605 11.5916C11.0604 11.3854 11.3854 11.0604 11.5853 10.6605L12.1853 9.46687C12.554 8.72946 13.3289 8.27952 14.1538 8.32951L15.4848 8.41075C15.9285 8.43575 16.3722 8.31702 16.7409 8.0733L17.8595 7.34214Z"
            fill={RankingColor.SECOND}
          />
        </g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill="black"
        >
          {Ranking.SECOND}
        </text>
        <defs>
          <filter
            id="filter0_d_1357_7082"
            x="0"
            y="0"
            width="38"
            height="38"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="1"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_1357_7082"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1357_7082"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1357_7082"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    ),
    [Ranking.THIRD]: (
      <svg
        {...props}
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Background" filter="url(#filter0_d_1357_7082)">
          <path
            d="M17.8595 7.34214C18.5469 6.88595 19.4468 6.88595 20.1342 7.34214L21.2466 8.0733C21.6215 8.31702 22.059 8.43575 22.5027 8.41075L23.8337 8.32951C24.6586 8.27952 25.4335 8.72946 25.8022 9.46687L26.4022 10.6605C26.6021 11.0604 26.9271 11.3791 27.3208 11.5791L28.5269 12.1853C29.2643 12.554 29.7142 13.3289 29.6642 14.1538L29.583 15.4848C29.558 15.9285 29.6767 16.3722 29.9205 16.7409L30.6579 17.8533C31.114 18.5407 31.114 19.4406 30.6579 20.128L29.9205 21.2466C29.6767 21.6215 29.558 22.059 29.583 22.5027L29.6642 23.8337C29.7142 24.6586 29.2643 25.4335 28.5269 25.8022L27.3333 26.4022C26.9333 26.6021 26.6146 26.9271 26.4147 27.3208L25.8085 28.5269C25.4398 29.2643 24.6649 29.7142 23.84 29.6642L22.5089 29.583C22.0652 29.558 21.6215 29.6767 21.2528 29.9205L20.1405 30.6579C19.4531 31.114 18.5532 31.114 17.8658 30.6579L16.7472 29.9205C16.3722 29.6767 15.9348 29.558 15.4911 29.583L14.16 29.6642C13.3351 29.7142 12.5602 29.2643 12.1915 28.5269L11.5916 27.3333C11.3916 26.9333 11.0667 26.6146 10.673 26.4147L9.46687 25.8085C8.72946 25.4398 8.27952 24.6649 8.32951 23.84L8.41075 22.5089C8.43575 22.0652 8.31702 21.6215 8.0733 21.2528L7.34214 20.1342C6.88595 19.4468 6.88595 18.5469 7.34214 17.8595L8.0733 16.7472C8.31702 16.3722 8.43575 15.9348 8.41075 15.4911L8.32951 14.16C8.27952 13.3351 8.72946 12.5602 9.46687 12.1915L10.6605 11.5916C11.0604 11.3854 11.3854 11.0604 11.5853 10.6605L12.1853 9.46687C12.554 8.72946 13.3289 8.27952 14.1538 8.32951L15.4848 8.41075C15.9285 8.43575 16.3722 8.31702 16.7409 8.0733L17.8595 7.34214Z"
            fill={RankingColor.THIRD}
          />
        </g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill="black"
        >
          {Ranking.THIRD}
        </text>
        <defs>
          <filter
            id="filter0_d_1357_7082"
            x="0"
            y="0"
            width="38"
            height="38"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="1"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_1357_7082"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1357_7082"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1357_7082"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    ),
  };

  return LeaderboardRanking[variant] || <></>;
};
