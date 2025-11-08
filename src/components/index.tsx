import Footer from './Footer/Footer';
import Header from './Header/Header';
import { Outlet } from 'react-router-dom';

function Index() {
  return (
  <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-[4rem]">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-grow  ">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="h-[3.5rem]">
        <Footer />
      </footer>
    </div>
  );
}

export default Index;
