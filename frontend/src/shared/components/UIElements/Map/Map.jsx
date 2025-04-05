
const Map = ({location: {lng, lat}}) => {
  return (
      <iframe
        title="map"
        src={`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3022.617356433582!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMTYuMyJX!5e0!3m2!1sru!2spl!4v1729596522311!5m2!1sru!2spl`}
        width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"></iframe>
  )
}

export default Map
