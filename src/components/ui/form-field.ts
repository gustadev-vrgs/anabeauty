import { cn } from '@/utils/cn';

export const formFieldBaseClass =
  'w-full rounded-xl border border-coffee-cappuccino bg-white px-3 text-sm text-coffee-darkRoast placeholder:text-coffee-hazelnut/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-colors duration-150 hover:border-coffee-macchiato focus:border-coffee-mocha focus:outline-none focus:ring-2 focus:ring-coffee-latte disabled:cursor-not-allowed disabled:border-coffee-cappuccino/70 disabled:bg-coffee-latte/60 disabled:text-coffee-hazelnut/80';

export const formFieldInputClass = cn('h-11', formFieldBaseClass);
export const formFieldTextareaClass = cn('min-h-24 py-2', formFieldBaseClass);
export const formFieldSelectClass = cn('h-11 pr-9', formFieldBaseClass);
