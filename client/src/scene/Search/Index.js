import React from 'react';
import './Index.css';

export default function Index() {
  return (
    <form className='search-container'>
      <input type='text' placeholder='Search Medicine here...' name='search' id='search'></input>
      <button type='button'>search</button>
    </form>
  )
}
