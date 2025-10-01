import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Store, DollarSign, Star, Eye, Download, Search, Plus, ShoppingCart, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  prompt_content: string;
  category: string;
  tags: string[];
  price: number;
  preview_content: string;
  downloads: number;
  views: number;
  seller_id: string;
  created_at: string;
  average_rating?: number;
  is_purchased?: boolean;
}

interface PromptMarketplaceProps {
  user: User | null;
}

export const PromptMarketplace = ({ user }: PromptMarketplaceProps) => {
  const { toast } = useToast();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketplaceListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  
  // Create listing form state
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    prompt_content: "",
    preview_content: "",
    category: "text",
    price: 0,
    tags: ""
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "text", label: "Text Generation" },
    { value: "image", label: "Image Creation" },
    { value: "code", label: "Code Generation" },
    { value: "analysis", label: "Data Analysis" },
    { value: "creative", label: "Creative Writing" },
    { value: "business", label: "Business" }
  ];

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, selectedCategory, searchQuery]);

  const loadListings = async () => {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading listings:', error);
      return;
    }

    // Load ratings and purchase status for each listing
    const enrichedListings = await Promise.all(
      (data || []).map(async (listing) => {
        // Get average rating
        const { data: ratings } = await supabase
          .from('prompt_ratings')
          .select('rating')
          .eq('prompt_id', listing.id);

        const avgRating = ratings && ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

        // Check if user has purchased
        let isPurchased = false;
        if (user) {
          const { data: purchase } = await supabase
            .from('prompt_purchases')
            .select('id')
            .eq('listing_id', listing.id)
            .eq('buyer_id', user.id)
            .single();
          
          isPurchased = !!purchase;
        }

        return {
          ...listing,
          average_rating: avgRating,
          is_purchased: isPurchased
        };
      })
    );

    setListings(enrichedListings);
  };

  const filterListings = () => {
    let filtered = listings;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(l => l.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredListings(filtered);
  };

  const createListing = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to create a listing",
        variant: "destructive"
      });
      return;
    }

    if (!newListing.title || !newListing.prompt_content || newListing.price < 0) {
      toast({
        title: "Invalid input",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from('marketplace_listings').insert({
      seller_id: user.id,
      title: newListing.title,
      description: newListing.description,
      prompt_content: newListing.prompt_content,
      preview_content: newListing.preview_content,
      category: newListing.category,
      price: newListing.price,
      tags: newListing.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    if (error) {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Listing created",
      description: "Your prompt is now available in the marketplace"
    });

    setNewListing({
      title: "",
      description: "",
      prompt_content: "",
      preview_content: "",
      category: "text",
      price: 0,
      tags: ""
    });
    setIsCreateDialogOpen(false);
    loadListings();
  };

  const purchaseListing = async (listing: MarketplaceListing) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to purchase prompts",
        variant: "destructive"
      });
      return;
    }

    if (listing.seller_id === user.id) {
      toast({
        title: "Cannot purchase",
        description: "You cannot purchase your own listing",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from('prompt_purchases').insert({
      listing_id: listing.id,
      buyer_id: user.id,
      price: listing.price
    });

    if (error) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    // Update downloads count
    await supabase
      .from('marketplace_listings')
      .update({ downloads: (listing.downloads || 0) + 1 })
      .eq('id', listing.id);

    toast({
      title: "Purchase successful",
      description: "You can now access the full prompt"
    });

    loadListings();
  };

  const incrementViews = async (listingId: string) => {
    // Get current views
    const { data } = await supabase
      .from('marketplace_listings')
      .select('views')
      .eq('id', listingId)
      .single();

    if (data) {
      await supabase
        .from('marketplace_listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', listingId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Prompt Marketplace</h2>
          <p className="text-muted-foreground">Discover and sell high-quality prompts</p>
        </div>
        {user && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>List Your Prompt</DialogTitle>
                <DialogDescription>
                  Sell your best prompts to the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                    placeholder="Amazing ChatGPT Prompt for..."
                  />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    placeholder="Describe what makes your prompt special..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={newListing.category}
                    onValueChange={(value) => setNewListing({ ...newListing, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.value !== 'all').map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price (USD) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: parseFloat(e.target.value) || 0 })}
                    placeholder="9.99"
                  />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    value={newListing.tags}
                    onChange={(e) => setNewListing({ ...newListing, tags: e.target.value })}
                    placeholder="chatgpt, business, marketing"
                  />
                </div>
                <div>
                  <Label>Preview Content</Label>
                  <Textarea
                    value={newListing.preview_content}
                    onChange={(e) => setNewListing({ ...newListing, preview_content: e.target.value })}
                    placeholder="Short preview of your prompt..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Full Prompt Content *</Label>
                  <Textarea
                    value={newListing.prompt_content}
                    onChange={(e) => setNewListing({ ...newListing, prompt_content: e.target.value })}
                    placeholder="Your complete prompt..."
                    rows={6}
                  />
                </div>
                <Button onClick={createListing} className="w-full">
                  Create Listing
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No prompts found</p>
            </CardContent>
          </Card>
        ) : (
          filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{listing.title}</CardTitle>
                <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge>{listing.category}</Badge>
                  {listing.tags?.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {listing.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {listing.downloads || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {listing.average_rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>

                {listing.preview_content && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm line-clamp-3">{listing.preview_content}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xl font-bold">{listing.price.toFixed(2)}</span>
                  </div>
                  {listing.is_purchased ? (
                    <Badge variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" />
                      Purchased
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        incrementViews(listing.id);
                        setSelectedListing(listing);
                      }}
                      disabled={!user || listing.seller_id === user?.id}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {listing.price === 0 ? 'Free' : 'Buy Now'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Purchase Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedListing?.title}</DialogTitle>
            <DialogDescription>{selectedListing?.description}</DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{selectedListing.prompt_content}</pre>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-2xl font-bold">{selectedListing.price.toFixed(2)}</span>
                </div>
                <Button onClick={() => {
                  purchaseListing(selectedListing);
                  setSelectedListing(null);
                }}>
                  Complete Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
