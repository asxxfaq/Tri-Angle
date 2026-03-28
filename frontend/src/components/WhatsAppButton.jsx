import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = '91755886974'; // Replace with actual number
  const message = 'Hello TRI-ANGLE! I would like to inquire about your catering services.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 9999,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      className="whatsapp-float"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="white"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.23-.115-.53-.19-.695-.102-.25-.823-1.88-.971-2.21-.118-.285-.247-.307-.464-.322l-.143-.007c-.452 0-.904.222-1.232.44-.38.25-.97.865-.97 2.03 0 .885.342 1.73.545 2.1.071.13 1.938 3.31 4.726 4.417.907.36 1.583.534 2.146.633a3.256 3.256 0 0 0 1.584-.094c.516-.075 1.583-.645 1.841-1.283.258-.637.258-1.162.186-1.282-.125-.195-.444-.315-.816-.315zM16.21 2c-7.726 0-14 6.274-14 14 0 2.406.633 4.733 1.84 6.812l-1.95 7.125 7.288-1.912A13.924 13.924 0 0 0 16.21 30c7.726 0 14-6.274 14-14s-6.274-14-14-14zm0 25.562c-2.103 0-4.156-.554-5.966-1.603l-.43-.25-4.43 1.162 1.185-4.32-.275-.436A11.528 11.528 0 0 1 4.706 16c0-6.38 5.188-11.562 11.504-11.562 6.315 0 11.504 5.182 11.504 11.562S22.525 27.562 16.21 27.562z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
