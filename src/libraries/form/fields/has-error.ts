export const hasError = ({
  meta: { isTouched, isPristine, isBlurred, isValid }
}: {
  meta: {
    isTouched: boolean;
    isPristine: boolean;
    isBlurred: boolean;
    isValid: boolean;
  };
}) => !isValid && ((isTouched && isPristine) || isBlurred);
