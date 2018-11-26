 import React from 'react';
import PropTypes from 'prop-types';
 import MainLayout from '#app/containers/MainLayout';

 const AppLayout = ({ dispatch, location, isMounted, children, pageName, isAuthenticated, screenWidth, isMobile }) => (
   <MainLayout
     showFooter
     dispatch={dispatch}
     location={location}
     isMounted={isMounted}
     pageName={pageName}
     isAuthenticated={isAuthenticated}
     screenWidth={screenWidth}
     isMobile={isMobile}
   >
   {
     children && React.cloneElement(children, {
       location,
       pageName,
       isAuthenticated,
     })
   }
   </MainLayout>
 );

 AppLayout.propTypes = {
   dispatch: PropTypes.func,
   location: PropTypes.object,
   isMounted: PropTypes.bool,
   isAuthenticated: PropTypes.bool,
   children: PropTypes.object.isRequired,
 };

 export default AppLayout;
