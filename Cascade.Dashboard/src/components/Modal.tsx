import React from 'react';

type ModalProps = {

};



export const Modal = ({ children }: React.PropsWithChildren<ModalProps>) => {
    return (
        <div>
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
    );
}

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
        <div>
            {children}
        </div>
    );
}