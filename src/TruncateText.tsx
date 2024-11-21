import React, { useEffect, useRef, useState } from 'react';
import { newLineToBreak } from './utils/newLine';

interface Props {
  children: string;
  ellipsisText: string;
  maxLine: number;
}

const TruncateText = ({ children, ellipsisText, maxLine }: Props) => {
  const templateContentRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [height, setHeight] = useState<number | 'auto'>(0);
  const [moreLeft, setMoreLeft] = useState<number>(0);

  const measureText = (text: string, canvas: CanvasRenderingContext2D) => {
    return canvas.measureText(text).width;
  };

  const getMaxWidth = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return 0;
    return wrapper.getBoundingClientRect().width;
  };

  const createCanvasContext = () => {
    const canvas = document.createElement('canvas');

    const canvasContext = canvas.getContext('2d');
    const templateContent = templateContentRef.current;
    if (!canvasContext || !templateContent) return null;

    const style = window.getComputedStyle(templateContent);

    canvasContext.font = [
      style.fontWeight,
      style.fontStyle,
      style.fontSize,
      style.fontFamily,
    ].join(' ');
    return canvasContext;
  };

  // Todo(Eddy): wordBreak 구현
  const getLines = (
    canvasContext: CanvasRenderingContext2D,
    contentText: string
    //wordBreak = 'break-all'
  ) => {
    const targetWidth = getMaxWidth();

    const texts = contentText.split('\n').map(text => text.trim());

    const lines: string[] = [];
    let currentLine = 0;

    texts.forEach(text => {
      let currentLeftCursor = 0;

      while (currentLeftCursor < text.length) {
        let lower = currentLeftCursor;
        let upper = text.length - 1;

        while (lower <= upper) {
          const middle = Math.floor((lower + upper) / 2);

          const testLine = text.slice(currentLeftCursor, middle + 1);
          let testLineWidth = measureText(testLine, canvasContext);
          if (testLineWidth <= targetWidth) {
            lower = middle + 1;
          } else {
            upper = middle - 1;
          }
        }

        lines.push(text.slice(currentLeftCursor, lower).trimStart());
        currentLeftCursor = lower;
        currentLine += 1;
      }
    });

    return lines;
  };

  const getMaxLineWidthWithEllipsis = (
    canvasContext: CanvasRenderingContext2D,
    text: string,
    ellipsisText: string
  ) => {
    const targetWidth = getMaxWidth();
    const ellipsisWidth = measureText(ellipsisText, canvasContext) + 2;

    let lower = 0;
    let upper = text.length - 1;

    while (lower <= upper) {
      const middle = Math.floor((lower + upper) / 2);

      const testLine = text.slice(0, middle + 1);
      let testLineWidth = measureText(testLine, canvasContext);

      if (testLineWidth + ellipsisWidth <= targetWidth) {
        lower = middle + 1;
      } else {
        upper = middle - 1;
      }
    }

    return measureText(text.slice(0, lower), canvasContext);
  };

  useEffect(() => {
    const templateContent = templateContentRef.current;
    const canvasContext = createCanvasContext();

    if (!templateContent || !canvasContext) return;

    const lines = getLines(canvasContext, children);

    if (lines.length > maxLine) {
      const lineHeight = parseFloat(
        window.getComputedStyle(templateContent).lineHeight
      );

      setIsExpanded(false);
      setIsOver(true);
      setHeight(lineHeight * maxLine);
      setMoreLeft(
        getMaxLineWidthWithEllipsis(
          canvasContext,
          lines[maxLine - 1],
          `...${ellipsisText}`
        )
      );

      const content = contentRef.current;

      if (content) {
        content.style.height = lineHeight * maxLine + 'px';
        content.style.transition = '';
        content.clientWidth;
        contentRef.current!.style.transition = 'height 0.2s ease-in-out';
      }
    } else {
      setHeight('auto');
      setIsOver(false);
    }
    setIsExpanded(false);
  }, [children, maxLine]);

  const handleClickExpand = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();

    const content = contentRef.current;
    if (content) setHeight(content.scrollHeight);
    setIsExpanded(prev => !prev);
  };

  return (
    <div style={{ width: '100%', position: 'relative' }} ref={wrapperRef}>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          lineHeight: '150%',
        }}
        ref={templateContentRef}
      />
      <div
        style={{
          height,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          overflow: 'hidden',
          lineHeight: '150%',
        }}
        ref={contentRef}
      >
        {newLineToBreak(children)}
      </div>

      {!isExpanded && isOver && (
        <span
          className="absolute bottom-0 pl-ds-2 right-0 "
          style={{
            position: 'absolute',
            bottom: 0,
            paddingLeft: 2,
            right: 0,
            color: '#4A4A4A',
            background: 'white',
            lineHeight: '150%',
            ...(moreLeft !== 0
              ? {
                  left: Math.round(moreLeft),
                }
              : {}),
          }}
          onClick={handleClickExpand}
        >
          ...{ellipsisText}
        </span>
      )}
    </div>
  );
};

export default TruncateText;
