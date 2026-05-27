import { motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export function AgentChatLoadingDots({
  className,
  ...props
}: React.ComponentProps<typeof motion.span>) {
  return (
    <motion.span
      layoutId="agent-chat-loading-dots"
      aria-label="Loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className={cn(
        "relative ml-[3.5em] inline-block size-[2.5em] animate-bubble-loader rounded-full text-muted-foreground/70 indent-[-9999em] transform-[translateZ(0)_translateY(-2.5em)] fill-mode-[both] [animation-delay:-0.16s] before:absolute before:top-0 before:left-[-3.5em] before:size-[2.5em] before:animate-bubble-loader before:rounded-full before:content-[''] before:fill-mode-[both] before:[animation-delay:-0.32s] after:absolute after:top-0 after:left-[3.5em] after:size-[2.5em] after:animate-bubble-loader after:rounded-full after:content-[''] after:fill-mode-[both]",
        className,
      )}
      {...props}
    />
  );
}
