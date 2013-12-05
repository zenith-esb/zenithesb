<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
  <html>
    <body>
       <h2>Credit Balance</h2>    
       <xsl:value-of select="balance"/>  
    </body>
  </html>
</xsl:template>
</xsl:stylesheet>

