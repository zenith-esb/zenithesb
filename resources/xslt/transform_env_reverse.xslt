<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:m="http://services.samples/xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
<xsl:output method="xml" omit-xml-declaration="yes" indent="no" exclude-result-prefixes="m"/>

<xsl:template match="m:buyStocks">

<m:skcotSyub xmlns:m="http://services.samples/xsd">
<xsl:for-each select="order">
<redro><lobmys><xsl:value-of select="symbol"/></lobmys><DIreyub><xsl:value-of select="buyerID"/></DIreyub><ecirp><xsl:value-of select="price"/></ecirp><emulov><xsl:value-of select="volume"/></emulov></redro>
</xsl:for-each>
</m:skcotSyub>
</xsl:template>
<xsl:template match="soapenv:Header"></xsl:template>
</xsl:stylesheet>
