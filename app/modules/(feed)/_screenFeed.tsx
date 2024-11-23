import React from 'react';
import { ScrollView } from 'react-native';
import Post from '../../components/feed/Post';

const ScreenFeed = () => {
  return (
    <ScrollView>
      <Post
        postId={1}
        profileImage="https://militaryhealthinstitute.org/wp-content/uploads/sites/37/2021/08/blank-profile-picture-png.png"
        username="Maria"
        time="1 Nov"
        image="https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg"
        caption="Descripción del post"
        likes={33}
        comments={[]}
      />
    </ScrollView>
  );
};

export default ScreenFeed;
