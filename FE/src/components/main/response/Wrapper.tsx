import styles from "@/css/main/response/Wrapper.module.css";


const Wrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
    return (
        <div {...props} className={styles.wrapper + " " + props.className} >
            {children}
        </div>
    );
}

export default Wrapper;