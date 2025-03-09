// library-inventory-system\src\components\Footer.tsx

const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xl">
              ©  {new Date().getFullYear()} BookNest. Developed by Nitrajsinh Solanki
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;