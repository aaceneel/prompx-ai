import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PromptMarketplace } from "@/components/PromptMarketplace";
import LegalPromptPacks from "@/components/LegalPromptPacks";
import { IndustryTemplates } from "@/components/IndustryTemplates";
import Layout from "@/components/Layout";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Marketplace = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Prompt Marketplace</h1>
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="legal">Legal Packs</TabsTrigger>
          </TabsList>
          <TabsContent value="marketplace">
            <PromptMarketplace user={user} />
          </TabsContent>
          <TabsContent value="templates">
            <IndustryTemplates onTemplateSelect={(template) => console.log(template)} />
          </TabsContent>
          <TabsContent value="legal">
            <LegalPromptPacks />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Marketplace;
