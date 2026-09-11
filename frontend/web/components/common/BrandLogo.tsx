"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BrandLogoProps {
  variant?: "horizontal" | "icon";
  height?: number;
  className?: string;
}

export function BrandLogo({ variant = "horizontal", height = 36, className = "" }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height, width: height * (variant === "horizontal" ? 3.5 : 1) }} />;
  }

  if (variant === "icon") {
    return (
      <Image
        src="/assets/branding/logo-icon.png"
        alt="eLearny Icon"
        width={height}
        height={height}
        className={className}
        priority
      />
    );
  }

  const logoSrc = resolvedTheme === "dark" 
    ? "/assets/branding/logo-dark.png" 
    : "/assets/branding/logo-light.png";

  return (
    <Image
      src={logoSrc}
      alt="eLearny Logo"
      width={height * 3.5}
      height={height}
      className={className}
      priority
    />
  );
}
