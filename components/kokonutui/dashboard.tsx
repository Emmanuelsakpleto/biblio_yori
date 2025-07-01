import Content from "./content";
import Layout from "./layout";
import { Toaster } from "@/components/ui/toaster";

export default function Dashboard() {
    return (
        <div data-theme="light">
            <Layout>
                <Content />
            </Layout>
            <Toaster />
        </div>
    );
}
