import styles from "./Button.module.css";

export type Variant = "primary" | "ghost" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export default function Button({ variant = "primary", className = "", ...rest }: Props) {
  return <button {...rest} className={`${styles.button} ${styles[variant]} ${className}`} />;
}