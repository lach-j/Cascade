import useTailwindStyles from "../hooks/useStyling";

type ButtonVariant = "primary" | "secondary" | "warn";

type ButtonProps = {
    variant?: ButtonVariant;
}


const Button = ({ children, variant = 'primary', ...props }: React.PropsWithChildren<ButtonProps & React.HtmlHTMLAttributes<HTMLButtonElement>>) => {

    const styles = useTailwindStyles({
        button: "px-4 py-2 rounded-lg cursor-pointer",
    }, {
        colorScheme: {
            primary: {
                button: "bg-green-500 text-white hover:bg-green-600",
            },
            secondary: {
                button: "bg-gray-500 text-white hover:bg-gray-600",
            },
            warn: {
                button: "bg-red-500 text-white hover:bg-red-600",
            },
        },
    });

    const variantStyles = styles.withColorScheme(variant);

    return (
        <button {...props} className={styles.cx(styles.button, variantStyles.button)}>
            {children}
        </button>);
}

export default Button;