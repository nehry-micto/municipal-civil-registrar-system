import { Button } from '@/components/ui/button';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import { login } from '@/routes';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <AuthSimpleLayout>
            <Head title="Welcome" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="prose max-w-none space-y-2 text-justify">
                    <h4>Welcome to the Civil Registrar System</h4>
                    <p>
                        This system is designed to streamline the management of
                        civil registration processes, including birth, marriage,
                        and death records. Navigate through the dashboard to
                        access various features and functionalities.
                    </p>
                    <Button className="mt-4 w-full" asChild>
                        <Link href={login.url()}>Login</Link>
                    </Button>
                </div>
            </div>
        </AuthSimpleLayout>
    );
}
