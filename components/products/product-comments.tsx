"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Star, MessageSquare, Edit, Trash2, Send, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { authenticatedFetch } from '@/lib/api'

interface Comment {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  rating: number;
  isApproved: boolean;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductCommentsProps {
  productId: string;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [commentForm, setCommentForm] = useState({
    content: "",
    rating: 5,
  });
  const [editForm, setEditForm] = useState({
    content: "",
    rating: 5,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    fetchComments();
  }, [productId, currentPage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log('Fetching comments for product:', productId);
      
      const response = await authenticatedFetch(
        `/api/products/${productId}/comments?page=${currentPage}&limit=10`
      );
      
      console.log('Comments response:', response.status, response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Comments fetch error:', errorData);
        throw new Error(errorData.error || "Failed to fetch comments");
      }

      const data = await response.json();
      console.log('Comments data:', data);
      
      setComments(data.comments);
      setTotalPages(data.pagination.pages);
      setTotalComments(data.pagination.total);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to leave a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log('Submitting comment:', { productId, commentForm, user });
      
      const response = await authenticatedFetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentForm),
      });

      console.log('Comment response:', response.status, response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('Comment error:', error);
        throw new Error(error.error || "Failed to submit comment");
      }

      const result = await response.json();
      console.log('Comment created:', result);

      toast({
        title: "Comment Submitted",
        description: "Your comment has been submitted for review",
      });

      setCommentForm({ content: "", rating: 5 });
      setShowCommentForm(false);

      // Refresh comments to show the updated count
      await fetchComments();
    } catch (error: any) {
      console.error('Comment submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;

    try {
      setSubmitting(true);
      const response = await authenticatedFetch(
        `/api/products/${productId}/comments/${editingComment._id}`,
        {
          method: "PUT",
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update comment");
      }

      toast({
        title: "Comment Updated",
        description: "Your comment has been updated successfully",
      });

      setShowEditForm(false);
      setEditingComment(null);
      setEditForm({ content: "", rating: 5 });
      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await authenticatedFetch(
        `/api/products/${productId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete comment");
      }

      toast({
        title: "Comment Deleted",
        description: "Your comment has been deleted successfully",
      });

      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (comment: Comment) => {
    setEditingComment(comment);
    setEditForm({
      content: comment.content,
      rating: comment.rating,
    });
    
    setShowEditForm(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="mt-8">
      {/* Combined Comments Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews ({totalComments})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          {user && (
            <div className="border-b border-gray-200 pb-6">
              {!showCommentForm ? (
                <Button
                  onClick={() => setShowCommentForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              ) : (
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() =>
                            setCommentForm((prev) => ({ ...prev, rating }))
                          }
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              rating <= commentForm.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <Textarea
                      value={commentForm.content}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Share your thoughts about this product..."
                      rows={4}
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {commentForm.content.length}/1000 characters
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={submitting || commentForm.content.length < 10}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Review
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCommentForm(false);
                        setCommentForm({ content: "", rating: 5 });
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading comments...</p>
            </div>
          ) : totalComments === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-semibold">
                          {comment.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {comment.userName}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {renderStars(comment.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.isEdited && (
                            <Badge variant="secondary" className="text-xs">
                              Edited
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {user && comment.userId === user._id && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            openEditForm(comment)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Comment Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditComment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setEditForm((prev) => ({ ...prev, rating }))}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= editForm.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <Textarea
                value={editForm.content}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Share your thoughts about this product..."
                rows={4}
                required
                minLength={10}
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {editForm.content.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={submitting || editForm.content.length < 10}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Review
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingComment(null);
                  setEditForm({ content: "", rating: 5 });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
