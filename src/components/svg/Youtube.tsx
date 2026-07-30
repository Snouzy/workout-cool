import * as React from "react";

export const YoutubeIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img
    alt="Youtube"
    height={props.height ?? 20}
    src="/icons/youtube.svg"
    style={{ display: "inline-block", verticalAlign: "middle" }}
    width={props.width ?? 20}
    {...props}
  />
);
