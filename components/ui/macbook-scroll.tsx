import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronDown,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconSearch,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-react";

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
  className,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5]
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.6, isMobile ? 1 : 1.5]
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className={cn(
        "min-h-[200vh]  flex flex-col items-center py-0 md:py-80 justify-start flex-shrink-0 [perspective:800px] transform md:scale-100  scale-[0.35] sm:scale-50",
        className
      )}
    >
      <motion.h2
        style={{
          translateY: textTransform,
          opacity: textOpacity,
        }}
        className="dark:text-white text-neutral-800 text-3xl font-bold mb-20 text-center"
      >
        {title || (
          <span>
            This Macbook is built with Tailwindcss. <br /> No kidding.
          </span>
        )}
      </motion.h2>
      {/* Lid */}
      <Lid
        src={src}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      />
      {/* Base Area */}
      <div className="h-[22rem] w-[32rem] bg-gray-200 dark:bg-[#272729] rounded-2xl overflow-hidden relative -z-10">
        {/* above keyboard bar */}
        <div className="h-10 w-full relative">
          <div className="absolute inset-x-0 mx-auto w-[80%] h-4 bg-[#050505]" />
        </div>
        <div className="flex relative">
          <div className="mx-auto w-[10%] overflow-hidden  h-full">
            <SpeakerGrid />
          </div>
          <div className="mx-auto w-[80%] h-full">
            <Keypad />
          </div>
          <div className="mx-auto w-[10%] overflow-hidden  h-full">
            <SpeakerGrid />
          </div>
        </div>
        <Trackpad />
        <div className="h-2 w-20 mx-auto inset-x-0 absolute bottom-0 bg-gradient-to-t from-[#272729] to-[#050505] rounded-tr-3xl rounded-tl-3xl" />
        {showGradient && (
          <div className="h-40 w-full absolute bottom-0 inset-x-0 bg-gradient-to-t dark:from-black from-white via-white dark:via-black to-transparent z-50"></div>
        )}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
}) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="h-[12rem] w-[32rem] bg-[#010101] rounded-2xl p-2 relative"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px var(--neutral-900) inset",
          }}
          className="absolute inset-0 bg-[#010101] rounded-lg flex items-center justify-center"
        >
          <span className="text-white">
            <IconAceternity />
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="h-[12rem] w-[32rem] absolute inset-0 bg-[#010101] rounded-2xl p-2"
      >
        <div className="absolute inset-0 bg-[#272729] rounded-lg" />

        {src && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt="macbook"
            className="object-cover object-left-top absolute inset-0 bg-[#010101] rounded-lg w-full h-full"
          />
        )}
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="w-[40%] mx-auto h-32  rounded-xl my-1"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    ></div>
  );
};

export const Keypad = () => {
  return (
    <div className="h-full rounded-md bg-[#050505] mx-1 p-1">
      {/* Row 1 */}
      <div className="flex justify-between">
        <KBtn
          className="w-10 items-end justify-start pl-[4px] pb-[2px]"
          childrenClassName="items-start"
        >
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F1</span>
        </KBtn>

        <KBtn>
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F2</span>
        </KBtn>
        <KBtn>
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F3</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F4</span>
        </KBtn>
        <KBtn>
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F5</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F6</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F7</span>
        </KBtn>
        <KBtn>
          <IconVolume className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipBack className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F9</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F10</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F11</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="inline-block mt-1">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-4 w-4 rounded-full  bg-gradient-to-b from-20% from-neutral-900 via-black to-neutral-900 p-px">
            <div className="bg-black h-full w-full rounded-full" />
          </div>
        </KBtn>
      </div>

      {/* Row 2 */}
      <div className="flex justify-between mt-[2px]">
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          ~
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          1
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          2
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          3
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          4
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          5
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          6
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          7
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          8
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          9
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          0
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          -
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          +
        </KBtn>
        <KBtn
          className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          delete
        </KBtn>
      </div>

      {/* Row 3 */}
      <div className="flex justify-between mt-[2px]">
        <KBtn
          className="w-[2.85rem] items-end justify-start pl-[4px] pb-[2px]"
          childrenClassName="items-start"
        >
          tab
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          Q
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          W
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          E
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          R
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          T
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          Y
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          U
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          I
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          O
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          P
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          [
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          ]
        </KBtn>
        <KBtn
          className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          \
        </KBtn>
      </div>

      {/* Row 4 */}
      <div className="flex justify-between mt-[2px]">
        <KBtn
          className="w-[3.65rem] items-end justify-start pl-[4px] pb-[2px]"
          childrenClassName="items-start"
        >
          caps lock
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          A
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          S
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          D
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          F
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          G
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          H
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          J
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          K
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          L
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          ;
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          &apos;
        </KBtn>
        <KBtn
          className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          return
        </KBtn>
      </div>

      {/* Row 5 */}
      <div className="flex justify-between mt-[2px]">
        <KBtn
          className="w-[4.65rem] items-end justify-start pl-[4px] pb-[2px]"
          childrenClassName="items-start"
        >
          shift
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          Z
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          X
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          C
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          V
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          B
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          N
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          M
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          ,
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          .
        </KBtn>
        <KBtn className="w-10 pl-[4px] pb-[2px] items-start">
          /
        </KBtn>
        <KBtn
          className="w-[4.65rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          shift
        </KBtn>
      </div>

      {/* Row 6 */}
      <div className="flex justify-between mt-[2px]">
        <KBtn
          className=""
          childrenClassName="items-end justify-start pl-[4px] pb-[2px]"
        >
          fn
        </KBtn>
        <KBtn
          className=""
          childrenClassName="items-end justify-start pl-[4px] pb-[2px]"
        >
          control
        </KBtn>
        <KBtn
          className=""
          childrenClassName="items-end justify-start pl-[4px] pb-[2px]"
        >
          option
        </KBtn>
        <KBtn
          className="w-12"
          childrenClassName="items-end justify-center pb-[2px]"
        >
          command
        </KBtn>
        <KBtn className="w-[8.2rem]"></KBtn>
        <KBtn
          className="w-12"
          childrenClassName="items-end justify-center pb-[2px]"
        >
          command
        </KBtn>
        <KBtn
          className=""
          childrenClassName="items-end justify-start pl-[4px] pb-[2px]"
        >
          option
        </KBtn>
        <div className="w-[4.9rem] mt-[2px] h-6 p-[0.5px] rounded-[4px] flex flex-col justify-end items-center">
          <KBtn className="w-6 h-3">
            <IconCaretUpFilled className="h-[6px] w-[6px]" />
          </KBtn>
          <div className="flex">
            <KBtn className="w-6 h-3">
              <IconCaretRightFilled className="h-[6px] w-[6px] -rotate-180" />
            </KBtn>
            <KBtn className="w-6 h-3">
              <IconChevronDown className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="w-6 h-3">
              <IconCaretRightFilled className="h-[6px] w-[6px]" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) => {
  return (
    <div
      className={cn(
        "p-[0.5px] rounded-[4px]",
        backlit && "bg-white/[0.2] shadow-xl shadow-white"
      )}
    >
      <div
        className={cn(
          "h-6 w-6 bg-[#0A090D] rounded-[3.5px] flex items-center justify-center",
          className
        )}
        style={{
          boxShadow:
            "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        <div
          className={cn(
            "text-neutral-200 text-[5px] w-full flex justify-center items-center flex-col",
            childrenClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div
      className="flex px-[0.5px] gap-[2px] mt-2 h-40"
      style={{
        backgroundImage:
          "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px",
      }}
    ></div>
  );
};

const IconAceternity = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-20 w-20"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
        style={{ mixBlendMode: "darken" }}
      />
    </svg>
  );
};
