const Logo = ({
  width = 20,
  height = 20,
  msgIconColor,
}: {
  width?: number;
  height?: number;
  msgIconColor?: string;
}) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      style={{ backgroundColor: "transparent", width, height }}
      xmlSpace="preserve"
    >
      <defs>
        {/* Define gradients with color placeholders */}
        <linearGradient
          id="gradient1"
          x1="337.8332"
          y1="374.7762"
          x2="436.0571"
          y2="146.6162"
        >
          <stop offset="0" style={{ stopColor: "#4AE1F6" }} />
          <stop offset="1" style={{ stopColor: "#00232A" }} />
        </linearGradient>
        <linearGradient
          id="gradient2"
          x1="21.5016"
          y1="265.9623"
          x2="291.9149"
          y2="265.9623"
        >
          <stop offset="0" style={{ stopColor: "#00CCDD" }} />
          <stop offset="1" style={{ stopColor: "#284E5F" }} />
        </linearGradient>
      </defs>

      <g>
        {/* Background Image */}
        <image
          style={{ overflow: "visible", opacity: 0.75 }}
          xlinkHref="70D5A45C.png"
          transform="matrix(1 0 0 1 -34 4)"
        />

        {/* First Gradient Shape */}
        <path
          fill="url(#gradient1)"
          d="M411.4,184.2c0,0,19.9,40.3,0,78.1c-19.9,37.8-81.2,78.1-156.3,73.3c0,0-48,49.3-60.8,87.1
              c0,0,71.4,30.5,174.2-20.2c2.1-1,4.7-0.7,6.5,0.8c9.3,8,38.6,31.7,59.9,32.1c0,0-18.5-39.6-17-67.4c0.2-3.7,1.8-7.1,4.3-9.8
              c15.9-16.6,77-88.9,33.7-178.7h-47.5L411.4,184.2z"
        />

        {/* Second Gradient Shape */}
        <path
          fill="url(#gradient2)"
          d="M285,129.5c0,0-40.6-24.2-119.3,1.8c-22.4,7.4-42.1,21.7-55.3,41.3c-8.9,13.3-15.9,30.5-15.3,51.1
              c1.5,55.1,29.1,50.6,34.5,74.3c5.4,23.7,4.6,42.9,12.3,36.8s13.8-28.3,13.8-28.3s36,28.3,99.6,29.1l-23,27.6
              c0,0-28.3,41.4-36.8,61.3c-8.4,19.9-75.8,95-73.5,57.4c2.3-37.5-6.9-53.6-17.6-82.7c-4.5-12.3-6.2-19.6-6.6-23.8
              c-0.4-4.6-2.7-8.9-6.2-11.9c-16.8-14.5-56.9-56.7-68.4-136.6C8.5,124.9,100.4,66.7,100.4,66.7s82.7-55.9,191.5-6.9
              c0,0-4.6,7.7-4.6,22.2S285,129.5,285,129.5z"
        />
      </g>

      {/* Solid Fill Shape */}
      <path
        fill="#53CDE6"
        d="M292.4,147.4c0,0-82.1-0.2-102.6-0.8c-7.9-0.2-15.7,0.9-23.1,3.7c-12.6,4.7-27,15-27,37.4v58.7
            c0,2.4-0.1,4.9-0.1,7.3c-0.2,7.4,0.9,31.5,25,40.2c4.8,1.7,9.9,2.5,15.1,2.5h33.1c3.3,0,6.5,1.2,9,3.3l34.6,29
            c1.3,1.1,3.2,0.9,4.2-0.5l20.1-27.1c1.9-2.6,5-4.1,8.2-4.1h14.2c9.1,0,18-2.3,25.8-7c9-5.5,17.9-14.9,17.7-30.8v-79.1
            C346.6,180.1,346,148.4,292.4,147.4z"
      />

      {/* Text and Icon Elements */}
      <g>
        <image
          style={{ overflow: "visible", opacity: 0.75 }}
          xlinkHref="70D5A45D.png"
          transform="matrix(1 0 0 1 258 34)"
        />

        <path
          className={`${
            msgIconColor
              ? msgIconColor
              : "dark:fill-light-primary fill-dark-primary"
          }`}
          d="M485.1,84.2c0,0-1.8-35.9-38.5-43.4c-4.2-0.9-8.5-1.2-12.7-1.1l-110.5,1c0,0-28.6-0.4-36.7,27.9
			c-1.1,3.8-1.6,7.7-1.7,11.6l-1.3,47.2c-0.2,8.3,1,16.6,3.9,24.3c3.3,8.8,9.2,18.7,19.8,24.4c5.5,2.9,11.7,4.3,17.9,4.2l32.4-0.5
			l47.6,49.6c0.8,0.9,2.3,0.3,2.3-0.9l1.5-47.7l32.4-0.5c7.4-0.1,14.8-1.7,21.5-5c10.3-5.2,21.9-15.5,22.2-36
			C485.7,102.1,485.1,84.2,485.1,84.2z M418.6,137.4c0,3.5-2.9,6.4-6.4,6.4H356c-3.5,0-6.4-2.9-6.4-6.4v0c0-3.5,2.9-6.4,6.4-6.4
			h56.2C415.7,131.1,418.6,133.9,418.6,137.4L418.6,137.4z M442,106H329.2c-3.4,0-6.1-2.8-6.1-6.1c0-3.4,2.8-6.1,6.1-6.1H442
			c3.4,0,6.1,2.8,6.1,6.1C448.2,103.3,445.4,106,442,106z"
        />
      </g>
    </svg>
  );
};

export default Logo;
