import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="size-10">
                <AppLogoIcon className="" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 leading-tight font-semibold">
                    Municipal Civil Registrar
                </span>
            </div>
        </>
    );
}
