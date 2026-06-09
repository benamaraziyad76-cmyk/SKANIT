// model-viewer type declarations for @google/model-viewer
declare namespace JSX {
    interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
            src?: string;
            'ios-src'?: string;
            alt?: string;
            ar?: boolean | string;
            'ar-modes'?: string;
            'ar-placement'?: string;
            'ar-scale'?: string;
            'camera-controls'?: boolean | string;
            'auto-rotate'?: boolean | string;
            'auto-rotate-delay'?: string | number;
            'rotation-per-second'?: string;
            'shadow-intensity'?: string | number;
            'shadow-softness'?: string | number;
            'environment-image'?: string;
            exposure?: string | number;
            'interaction-prompt'?: string;
            'interaction-prompt-threshold'?: string | number;
            loading?: string;
            reveal?: string;
            poster?: string;
            style?: React.CSSProperties;
            ref?: React.Ref<any>;
            onLoad?: () => void;
            onProgress?: (event: any) => void;
            onError?: (event: any) => void;
        }, HTMLElement>;
    }
}
