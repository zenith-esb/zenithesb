<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:m="http://services.samples/xsd">
<xsl:output method="xml" omit-xml-declaration="yes" indent="no" exclude-result-prefixes="m"/>

<xsl:template match="m:skcotSyub">

<m:buyStocks xmlns:m0="http://services.samples/xsd">
<xsl:for-each select="redro">
<order><symbol><xsl:value-of select="lobmys"/></symbol><buyerID><xsl:value-of select="DIreyub"/></buyerID><price><xsl:value-of select="ecirp"/></price><volume><xsl:value-of select="emulov"/></volume></order>
</xsl:for-each>
</m:buyStocks>
</xsl:template>        
</xsl:stylesheet>
