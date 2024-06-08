import { useState, useEffect, useRef } from "react";
type DebouncedFunction<T extends (...args: any[]) => any> = {
    (this: ThisParameterType<T>, ...args: Parameters<T>): void;
    cancel: () => void;
};

function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): DebouncedFunction<T> {
    let timeout: ReturnType<typeof setTimeout>;

    const debouncedFunction = function (
        this: ThisParameterType<T>,
        ...args: Parameters<T>
    ) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    } as DebouncedFunction<T>;

    debouncedFunction.cancel = () => {
        clearTimeout(timeout);
    };

    return debouncedFunction;
}

function useDebouncedState<T>(initialValue: T, delay: number): [T, T, (value: T) => void] {
    const [value, setValue] = useState<T>(initialValue);
    const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
    const debouncedSetState = useRef(debounce(setDebouncedValue, delay)).current;
  
    useEffect(() => {
      return () => {
        debouncedSetState.cancel();
      };
    }, [debouncedSetState]);
  
    const setState = (newValue: T) => {
      setValue(newValue);
      debouncedSetState(newValue);
    };
  
    return [value, debouncedValue, setState];
  }

export default useDebouncedState;
