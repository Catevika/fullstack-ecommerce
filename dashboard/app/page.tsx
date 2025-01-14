import {redirect} from 'next/navigation';

// TODO - Create an automatic deployment on Expo Go linked to Github to allow users to test the app

export default function Home() {
  redirect('/dashboard/products');
}
