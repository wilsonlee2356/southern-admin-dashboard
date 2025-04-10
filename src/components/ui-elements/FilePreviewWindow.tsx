"use client";
import React, { JSX } from "react";

type FilePreviewWindowPropsType = {
    source: string | undefined;
    width: number;
    height: number;
}



function FilePreviewWindow ({ source, width, height }: FilePreviewWindowPropsType){
    return (
        <>
            <iframe
                src={source}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    minWidth: "100%",
                    minHeight: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    border: "none",
                }}
            ></iframe>
        </>
    );
};

export default FilePreviewWindow;
