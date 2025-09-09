import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { Comment } from '../types/product';
import { UserType } from '../types/navigation';
import { addComment } from '../services/api';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';

export interface CommentSectionProps {
  productId: number;
  comments: Comment[];
  onCommentAdded: () => void;
  user: UserType;
}

export default function CommentSection({ productId, comments, onCommentAdded, user }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        setIsSubmitting(true);
        await addComment(productId, newComment, user.id, selectedRating);
        setNewComment('');
        setSelectedRating(5); // Reset rating after submission
        onCommentAdded();
      } catch (error) {
        console.error('Error adding comment:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{(item.user?.full_name || 'User').charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.user?.full_name || 'Anonymous User'}</Text>
            <Text style={styles.commentDate}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <FontAwesome 
              key={index} 
              name={index < item.rating ? "star" : "star-o"} 
              size={14} 
              color={index < item.rating ? "#F3603F" : "#BDBDBD"} 
              style={styles.star} 
            />
          ))}
        </View>
      </View>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Đánh giá</Text>
        {comments.length > 0 && (
          <Text style={styles.commentCount}>{comments.length} {comments.length === 1 ? 'Phản hồi' : 'Phản hồi'}</Text>
        )}
      </View>
      
      <View style={styles.addCommentContainer}>
        <Text style={styles.addCommentTitle}>Thêm đánh giá</Text>
        <View style={styles.ratingSelector}>
          <Text style={styles.ratingLabel}>Đánh giá của bạn:</Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => setSelectedRating(ratingValue)}
                >
                  <FontAwesome 
                    name={ratingValue <= selectedRating ? "star" : "star-o"} 
                    size={24} 
                    color={ratingValue <= selectedRating ? "#F3603F" : "#BDBDBD"} 
                    style={styles.ratingStar} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Ghi những gì bạn nghĩ về sản phẩm"
            multiline
            numberOfLines={4}
          />
        </View>
        <TouchableOpacity
          style={[styles.addButton, !newComment.trim() && styles.addButtonDisabled]}
          onPress={handleAddComment}
          disabled={!newComment.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.addButtonText}>Gửi</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Đánh giá</Text>
        {comments.length > 0 ? (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
            style={styles.commentList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noCommentsContainer}>
            <Feather name="message-circle" size={50} color="#E2E2E2" />
            <Text style={styles.noComments}>Chưa có đánh giá</Text>
            <Text style={styles.noCommentsSubtext}>Để lại đánh giá đầu tiên</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#181725',
  },
  commentCount: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  addCommentContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  addCommentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 15,
  },
  ratingSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#181725',
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingStar: {
    marginRight: 5,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    marginBottom: 15,
  },
  input: {
    minHeight: 100,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#181725',
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#53B175',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#A8D5B5',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsContainer: {
    flex: 1,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 15,
  },
  commentList: {
    flex: 1,
  },
  commentItem: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  commentDate: {
    fontSize: 12,
    color: '#7C7C7C',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    marginLeft: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#181725',
    lineHeight: 22,
  },
  noCommentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  noComments: {
    textAlign: 'center',
    color: '#181725',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  noCommentsSubtext: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 14,
    marginTop: 5,
  },
}); 