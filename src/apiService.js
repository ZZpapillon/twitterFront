import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
const baseURL = 'https://twitternode.onrender.com/api'; // Replace with your backend URL


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${baseURL}/register`, userData);
        const { token } = response.data; // Extract the token from the response
        localStorage.setItem('token', token); // Store the token in local storage
        return token; // Return the token

    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${baseURL}/login`, userData);
        const { token } = response.data; 
        localStorage.setItem('token', token); // Store the token in local storage
        return token; // Return the token
    } catch (error) {
        throw error.response.data
    }
}

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await axios.get(`${baseURL}/allUsers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response contains the list of users
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const getUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await axios.get(`${baseURL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response contains the user data
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const updateUser = async (userData) => {
  try {

     const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const { userId, firstName, lastName, bio, profilePicture, backgroundPicture } = userData;
    
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('bio', bio);

    // Append files if they exist
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    if (backgroundPicture) {
      formData.append('backgroundPicture', backgroundPicture);
    }

    
     
    

    const response = await axios.put(`${baseURL}/user/${userId}`, formData, 
    
     {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
      return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const createTweet = async (tweetData, file) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    // Create an instance of FormData
    const formData = new FormData();

    // Append the tweet text data to formData
    formData.append('content', tweetData.content);
    formData.append('authorId', tweetData.authorId);

    // If a file is included, append it to formData
    // The 'file' field name should match what your backend expects
    if (file) {
      formData.append('media', file);
    }

    const response = await axios.post(`${baseURL}/tweet`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't manually set 'Content-Type': 'multipart/form-data',
        // axios will set it correctly based on the formData object
      }
    });

    return response.data; // Assuming the response contains the newly created tweet
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const getAllTweets = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await axios.get(`${baseURL}/tweets`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response contains the list of all tweets
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const getTweetById = async (tweetId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await axios.get(`${baseURL}/tweet/${tweetId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response contains the tweet with the given ID
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const deleteTweet = async (tweetId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await axios.delete(`${baseURL}/tweet/${tweetId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response confirms the deletion of the tweet
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};



export const likeTweet = async (tweetId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    // const decodedToken = jwtDecode(token);
    // const userId = decodedToken.id;
    // console.log('User ID:', userId);
    
    const response = await axios.post(`${baseURL}/tweet/${tweetId}/like`, tweetId,  {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response confirms the deletion of the tweet
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const retweet = async (tweetId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    // const decodedToken = jwtDecode(token);
    // const userId = decodedToken.id;
    // console.log('User ID:', userId);
    
    const response = await axios.post(`${baseURL}/tweet/${tweetId}/retweet`, {},  {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response confirms the deletion of the tweet
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const unretweet = async (tweetId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    // const decodedToken = jwtDecode(token);
    // const userId = decodedToken.id;
    // console.log('User ID:', userId);
    
    const response = await axios.post(`${baseURL}/tweet/${tweetId}/unretweet`, {},  {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response confirms the deletion of the tweet
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const postReply = async (tweetId, replyData, file) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const formData = new FormData();
    formData.append('content', replyData.content);
    if (file) {
      formData.append('media', file);
    }

    const response = await axios.post(`${baseURL}/tweet/${tweetId}/reply`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type is automatically set to multipart/form-data by axios when using FormData
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReplies = async (tweetId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.get(`${baseURL}/tweet/${tweetId}/replies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data; // Assuming the response contains the list of replies
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const followUser = async (userId, followId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.post(`${baseURL}/user/${userId}/follow`, { followId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data; // Assuming the response contains the list of replies
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const unfollowUser = async (userId, followId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.post(`${baseURL}/user/${userId}/unfollow`, { followId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data; // Assuming the response contains the list of replies
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

export const startConversation = async (participants) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.post(`${baseURL}/conversations`, { participants }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.get(`${baseURL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const sendMessage = async (conversationId, content) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.post(`${baseURL}/messages`, { conversationId, content }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.get(`${baseURL}/conversations/${conversationId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    
    const response = await axios.get(`${baseURL}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data; // Assuming the response contains the list of all tweets
  } catch (error) {
    throw error; // Handle error appropriately in the component
  }
};

