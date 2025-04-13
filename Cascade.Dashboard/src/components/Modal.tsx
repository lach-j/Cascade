import React from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import useTailwindStyles from '../hooks/useStyling';

type ModalProps = {
    onClose?: () => void;
    isOpen?: boolean;
};

export const Modal = ({ children, isOpen = false, onClose }: React.PropsWithChildren<ModalProps>) => {

    const styles = useTailwindStyles({
        modal: 'fixed inset-0 bg-black/70 flex items-center justify-center',
        modalContent: 'bg-white p-5 rounded-lg max-w-3/4 flex flex-col gap-8',
    });

    const modalRef = React.useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, () => {
        if (onClose) {
            onClose();
        }
    });

    const hiddenModalStyles = styles.modalIf(!isOpen, 'hidden');

    return (
        <div className={styles.cx(styles.modal, hiddenModalStyles)}>
            <div className={styles.modalContent} ref={modalRef}>
                <div>
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            if (child.type === ModalHeader) {
                                return child;
                            }
                        }
                    }
                    )}
                </div>
                <div>
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            if (child.type === ModalBody) {
                                return child;
                            }
                        }
                    }
                    )}
                </div>
                <div>
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            if (child.type === ModalFooter) {
                                return child;
                            }
                        }
                    }
                    )}
                </div>
            </div>
        </div>
    );
};

export const ModalHeader = ({ children }: React.PropsWithChildren) => {
    return (
        <div>
            {children}
        </div>
    );
}

export const ModalBody = ({ children }: React.PropsWithChildren) => {
    return (
        <div>
            {children}
        </div>
    );
}

export const ModalFooter = ({ children }: React.PropsWithChildren) => {
    return (
        <div className='flex justify-end gap-3'>
            {children}
        </div>
    );
}