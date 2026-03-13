type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg
      className={className}
      width="20"
      height="31"
      viewBox="0 0 20 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.91089 0L14.016 4.99461C16.2996 7.77291 15.935 11.8687 13.1966 14.2C13.2696 13.561 13.0795 12.9199 12.6699 12.424C13.0795 12.9199 13.2696 13.561 13.1966 14.2L10.1359 16.6913C9.79143 16.9717 9.74127 17.4789 10.0241 17.8213L13.0545 21.4896C13.1958 21.6607 13.4494 21.684 13.6196 21.5415L17.9597 17.908C20.1476 16.0762 20.4507 12.8235 18.6388 10.619L9.91089 0Z"
        fill="url(#brandLogoPrimary)"
      />
      <path
        d="M13.1966 14.2C15.935 11.8687 16.2996 7.77291 14.016 4.99461L9.91089 0C6.71089 2.2 7.32388 5.95257 9.4048 8.47158L12.6699 12.424C13.0795 12.9199 13.2696 13.561 13.1966 14.2Z"
        fill="url(#brandLogoSecondary)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.91089 30.8L5.80573 25.8054C3.52219 23.0271 3.8868 18.9313 6.62517 16.6C6.55215 17.239 6.74232 17.8801 7.15192 18.376C6.74232 17.8802 6.55215 17.239 6.62517 16.6L9.68592 14.1087C10.0303 13.8284 10.0805 13.3211 9.79767 12.9787L6.76732 9.31042C6.62597 9.13931 6.37234 9.116 6.20216 9.25847L1.86208 12.892C-0.325871 14.7238 -0.628943 17.9765 1.18293 20.181L9.91089 30.8Z"
        fill="url(#brandLogoTertiary)"
      />
      <path
        d="M6.62517 16.6C3.8868 18.9313 3.52219 23.0271 5.80573 25.8054L9.91089 30.8C13.1109 28.6 12.4979 24.8474 10.417 22.3284L7.15192 18.376C6.74232 17.8801 6.55215 17.239 6.62517 16.6Z"
        fill="url(#brandLogoQuaternary)"
      />
      <defs>
        <linearGradient
          id="brandLogoPrimary"
          x1="9.91089"
          y1="0"
          x2="9.91089"
          y2="30.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3408BB" />
          <stop offset="1" stopColor="#E7D9F7" />
        </linearGradient>
        <linearGradient
          id="brandLogoSecondary"
          x1="9.91089"
          y1="0"
          x2="9.91089"
          y2="30.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E2DAFF" />
          <stop offset="1" stopColor="#D0D0D0" />
        </linearGradient>
        <linearGradient
          id="brandLogoTertiary"
          x1="9.91089"
          y1="0"
          x2="9.91089"
          y2="30.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3408BB" />
          <stop offset="1" stopColor="#E7D9F7" />
        </linearGradient>
        <linearGradient
          id="brandLogoQuaternary"
          x1="9.91089"
          y1="0"
          x2="9.91089"
          y2="30.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E2DAFF" />
          <stop offset="1" stopColor="#D0D0D0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
