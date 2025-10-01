import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/components/UserProfile";
import ApiKeyManagement from "@/components/ApiKeyManagement";
import ABTestingPanel from "@/components/ABTestingPanel";
import Layout from "@/components/Layout";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
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
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="apikeys">API Keys</TabsTrigger>
            <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <UserProfile userId={user?.id || ""} />
          </TabsContent>
          <TabsContent value="apikeys">
            <ApiKeyManagement user={user} />
          </TabsContent>
          <TabsContent value="abtesting">
            <ABTestingPanel user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
