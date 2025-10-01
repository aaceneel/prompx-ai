import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TeamManagement } from "@/components/TeamManagement";
import { TeamPromptCollaboration } from "@/components/TeamPromptCollaboration";
import Layout from "@/components/Layout";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Team = () => {
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
        <h1 className="text-4xl font-bold mb-8">Team Management</h1>
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="management">Team Members</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>
          <TabsContent value="management">
            <TeamManagement user={user} />
          </TabsContent>
          <TabsContent value="collaboration">
            <TeamPromptCollaboration user={user} teamId={user?.id || ""} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Team;
